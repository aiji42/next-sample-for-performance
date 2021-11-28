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

  const playlists = await db.playlist.findMany({
    select: {
      id: true,
      name: true,
      cover: true,
      user: {
        select: {
          name: true
        }
      }
    }
  })

  return { playlists, user }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const props = await loader()

  return { props: { ...props, isCaching: false } }
}

type Prop = {
  playlists: {
    id: string
    name: string
    cover: string
    user: { name: string } | null
  }[]
}

const Artist: VFC<Prop> = ({ playlists }) => {
  return (
    <div className="container mx-auto min-h-screen">
      <Head>
        <title>Playlists | Remix Sample</title>
      </Head>
      <h2 className="mt-24 text-5xl font-semibold text-white">Playlists</h2>
      <div className="mt-12">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {playlists.map((playlist) => (
            <div className="px-4 py-8" key={playlist.id}>
              <div>
                <Link href={`/playlist/${playlist.id}`} passHref>
                  <a>
                    <Image src={playlist.cover} width={250} height={250} />
                  </a>
                </Link>
              </div>

              <div>
                <Link href={`/playlist/${playlist.id}`} passHref>
                  <a className="font-semibold block hover:text-white mt-2">
                    {playlist.name}
                  </a>
                </Link>
                <div>Created by {playlist.user?.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Artist
