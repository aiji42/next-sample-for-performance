import Playlist, { loader } from '../../playlist/[id]'
import { GetStaticPaths, GetStaticProps } from 'next'
import { createClient } from '@supabase/supabase-js'

export const getStaticPaths: GetStaticPaths = async () => {
  const supabase = () =>
    createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_API_KEY ?? '',
      {
        fetch
      }
    )

  const { data } = await supabase().from('Playlist').select('id')
  return {
    paths: data?.map(({ id }) => `/ssg/playlist/${id}`) ?? [],
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

export default Playlist
