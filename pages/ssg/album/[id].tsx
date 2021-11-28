import Album, { loader } from '../../album/[id]'
import { GetStaticPaths, GetStaticProps } from 'next'
import { PrismaClient } from '@prisma/client'

export const getStaticPaths: GetStaticPaths = async () => {
  const db = new PrismaClient()
  const data = await db.album.findMany({
    select: {
      id: true
    }
  })
  return {
    paths: data.map(({ id }) => `/ssg/album/${id}`),
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
