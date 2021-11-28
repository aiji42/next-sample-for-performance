import Playlist, { loader } from '../../playlist'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const props = await loader()

  return { props: { ...props, isCaching: true } }
}

export default Playlist
