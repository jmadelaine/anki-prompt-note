import { doRequest } from 'api/doRequest'
import { is, isArrayOf } from 'ts-guardian'
import { AnkiNote } from 'types/data'

// Docs: https://foosoft.net/projects/anki-connect/index.html
export const getRandomNote = async (): Promise<AnkiNote | undefined> => {
  const noteIdsRes = await doRequest({
    url: 'http://127.0.0.1:8765', // TODO: allow port config
    method: 'post',
    payload: {
      action: 'findNotes',
      version: 6,
      params: { query: '(deck:VocabJP::Hiragana OR deck:VocabJP::Kanji) prop:ease>0' },
    },
  })

  // TODO: show error
  if (!is({ result: isArrayOf('number') })(noteIdsRes)) return undefined
  const randomId = noteIdsRes.result[Math.floor(Math.random() * noteIdsRes.result.length)]

  const noteInfoRes = await doRequest({
    url: 'http://127.0.0.1:8765', // TODO: allow port config
    method: 'post',
    payload: { action: 'notesInfo', version: 6, params: { notes: [randomId] } },
  })

  // TODO: show error
  if (
    !is({
      result: [
        {
          noteId: 'number',
          modelName: 'string',
          tags: isArrayOf('string'),
          fields: { word: { value: 'string' }, rubi: { value: 'string' }, def: { value: 'string' } },
        },
      ],
    })(noteInfoRes)
  ) {
    return undefined
  }

  const {
    fields: {
      word: { value: word },
      rubi: { value: rubi },
      def: { value: def },
    },
  } = noteInfoRes.result[0]

  return { id: String(randomId), word, rubi, def }
}
