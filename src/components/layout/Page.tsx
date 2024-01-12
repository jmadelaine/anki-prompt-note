import { PComp } from 'types/utils'
import { Col } from './Layout'

export const Page: PComp = p => {
  return (
    <Col position="absolute" inset="0">
      {p.children}
    </Col>
  )
}
