import { getRandomNote } from 'api/getRandomNote'
import { Button } from 'components/input/Button'
import { Col, Row } from 'components/layout/Layout'
import { Page } from 'components/layout/Page'
import { Text } from 'components/presentation/Text'
import { useHotkeys } from 'helpers/hotkeys'
import { For, createEffect, createSignal, on } from 'solid-js'
import { css, theme } from 'style/theme'
import { is, isArrayOf } from 'ts-guardian'
import { AnkiNote } from 'types/data'
import { Comp, PComp } from 'types/utils'

/**
 * Config
 * - how often repeated words can appear (no repeated words in last n words)
 * - search query (let the user type their own, it's too complex to create a search query editor)
 * - a map to indicate which note fields relate to word, rubi, definition, etc, takes into account
 *   the note type, as separate note types may have conflicting field names
 * - maybe allow custom formatter for fields (e.g. definition field)
 */

const createSpaceKeySingleOnDownAction = (onDown: () => void) => {
  const [isSpaceKeyDown, setIsSpaceKeyDown] = createSignal(false)
  useHotkeys({
    ' ': {
      down: () => {
        if (isSpaceKeyDown()) return
        onDown()
        setIsSpaceKeyDown(true)
      },
      up: () => setIsSpaceKeyDown(false),
    },
  })
}

export const RootPage: Comp = () => {
  const [notes, setNotes] = createSignal<AnkiNote[]>([])

  const getAndSetRandomNote = async () => {
    const note = await getRandomNote()
    if (!note) return
    setNotes(v => [...v, note])
  }
  createSpaceKeySingleOnDownAction(getAndSetRandomNote)

  const [noteIdsWithVisibleRubi, setNoteIdsWithVisibleRubi] = createSignal<string[]>([])
  const toggleRubi = (noteId: string) => {
    setNoteIdsWithVisibleRubi(v => (v.includes(noteId) ? v.filter(id => id !== noteId) : [...v, noteId]))
    // Queue a scroll down if we're expanding the last note
    // TODO: we should just make sure the expanded note is in view instead
    if (noteId === notes().at(-1)?.id) setTimeout(scrollToEnd, 1)
  }

  let notesListRef: HTMLDivElement | undefined
  const scrollToEnd = () => notesListRef?.scroll({ top: notesListRef.scrollHeight })
  createEffect(on([notes], scrollToEnd))
  useHotkeys({
    r: () => {
      const finalNote = notes().at(-1)
      if (finalNote) toggleRubi(finalNote.id)
    },
  })

  return (
    <Page>
      <Col flex={1}>
        <Col ref={notesListRef} scrollable={true} gap="1rem" align="center" padding="1rem 0 4rem 0">
          <For each={notes()}>
            {note => (
              <Note
                note={note}
                isRubiVisible={noteIdsWithVisibleRubi().includes(note.id)}
                onClick={() => toggleRubi(note.id)}
              />
            )}
          </For>
        </Col>
        <Col
          flex={1}
          gap="2rem"
          padding="2rem 0"
          class={css({
            borderTop: `1px solid ${theme.colors.text(0, 0.125)}`,
            backgroundColor: theme.colors.background(1),
            boxShadow: '0 0 2rem 1rem rgba(0,0,0,0.3)',
          })}
        >
          <Col scrollable={true} align="center" gap="0.5rem" padding="0 2rem">
            <Col>
              <For each={JSON.parse(notes().at(-1)?.def.replaceAll('\\\\', '\\') ?? '[]')}>
                {d => {
                  if (!is([isArrayOf('string'), isArrayOf('string')])(d)) throw new Error('Def is not string[][]')
                  const [wordType, definition] = d

                  return (
                    <Col>
                      <Row gap="0.5rem">
                        <For each={wordType}>
                          {wt => (
                            <Text
                              class={css({
                                padding: '0.125rem 0.5rem',
                                borderRadius: '99999px',
                                textTransform: 'uppercase',
                                fontSize: theme.font.size.xs,
                                fontWeight: theme.font.weight.semibold,
                                color: theme.colors.text(0, 0.875),
                                backgroundColor:
                                  {
                                    vt: '#8611AD',
                                    vi: '#8611AD',
                                    v1: '#AD1138',
                                    'v1-s': '#AD1138',
                                    v5aru: '#AD1138',
                                    v5b: '#AD1138',
                                    v5g: '#AD1138',
                                    v5k: '#AD1138',
                                    v5m: '#AD1138',
                                    v5n: '#AD1138',
                                    v5r: '#AD1138',
                                    v5s: '#AD1138',
                                    v5t: '#AD1138',
                                    v5u: '#AD1138',
                                  }[wt] ?? theme.colors.text(0, 0.2),
                              })}
                              size="md"
                              color={theme.colors.text(0, 0.5)}
                            >
                              {{
                                vt: 'transitive',
                                vi: 'intransitive',
                                v1: 'Ichidan verb',
                                'v1-s': 'Ichidan verb (kureru)',
                                v5aru: 'Godan verb (aru)',
                                v5b: 'Godan verb',
                                v5g: 'Godan verb',
                                v5k: 'Godan verb',
                                v5m: 'Godan verb',
                                v5n: 'Godan verb',
                                v5r: 'Godan verb',
                                v5s: 'Godan verb',
                                v5t: 'Godan verb',
                                v5u: 'Godan verb',
                              }[wt] ?? wt}
                            </Text>
                          )}
                        </For>
                      </Row>

                      <Text size="lg" color={theme.colors.text(0, 0.5)}>
                        {definition.join('; ')}
                      </Text>
                    </Col>
                  )
                }}
              </For>
            </Col>
          </Col>
          <Col align="center" padding="0 2rem">
            <PrimaryButton onClick={getAndSetRandomNote}>{'Random Word'}</PrimaryButton>
          </Col>
        </Col>
      </Col>
    </Page>
  )
}

const Note: Comp<{ note: AnkiNote; isRubiVisible: boolean; onClick: () => void }> = p => {
  return (
    <Col
      asButton={true}
      onClick={() => p.onClick()}
      padding="1rem"
      gap="0.5rem"
      align="center"
      class={css({
        backgroundColor: theme.colors.background(2),
        borderRadius: '1rem',
        width: 'min(32rem, calc(100% - 2rem))',
        boxShadow: theme.shadow[2],
        '&:hover': { backgroundColor: theme.colors.background(3) },
      })}
    >
      <Text size="xxl">{p.note.word}</Text>
      {p.isRubiVisible && (
        <Text size="xl" color={theme.colors.text(0, 0.2)}>
          {p.note.rubi}
        </Text>
      )}
    </Col>
  )
}

const PrimaryButton: PComp<{ onClick: () => void }> = p => {
  return (
    <Button
      class={css({
        width: '12rem',
        height: '4rem',
        color: '#fff',
        backgroundColor: theme.colors.primary(4),
        borderRadius: '0.375rem',
        fontSize: theme.font.size.lg,
      })}
      onClick={() => p.onClick()}
    >
      {p.children}
    </Button>
  )
}
