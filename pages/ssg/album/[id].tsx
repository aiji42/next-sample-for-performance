import Album, { loader } from '../../album/[id]'
import { GetStaticPaths, GetStaticProps } from 'next'

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id
  if (typeof id !== 'string')
    return {
      notFound: true
    }
  const props = await loader(id)

  return { props: { ...props, isCaching: true } }
}

export default Album
