import Album, { loader } from '../../album'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const props = await loader()

  return { props: { ...props, isCaching: true } }
}

export default Album
