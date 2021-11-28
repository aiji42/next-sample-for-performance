import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

export const loader = async () => {
  const db = new PrismaClient()

  const user = await db.user.findFirst({
    select: {
      name: true,
      playlists: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  const artists = await db.artist.findMany({
    select: {
      id: true,
      name: true,
      picture: true
    }
  })

  return { artists, user }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const props = await loader()

  return { props: { ...props, isCaching: false } }
}

type Prop = {
  artists: { id: string; name: string; picture: string }[]
}

const Artist: VFC<Prop> = ({ artists }) => {
  return (
    <div className="container mx-auto min-h-screen">
      <Head>
        <title>Artists | Remix Sample</title>
      </Head>
      <h2 className="mt-24 text-5xl font-semibold text-white">Artists</h2>
      <div className="mt-12">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {artists.map((artist) => (
            <div className="px-4 py-8" key={artist.id}>
              <div>
                <Link href={`/artist/${artist.id}`} passHref>
                  <a>
                    <Image src={artist.picture} width={250} height={250} />
                  </a>
                </Link>
              </div>

              <div>
                <Link href={`/artist/${artist.id}`} passHref>
                  <a className="font-semibold block hover:text-white mt-2">
                    {artist.name}
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Artist
