import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { PrismaClient } from '@prisma/client'

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
    take: 5,
    select: {
      id: true,
      name: true,
      picture: true
    }
  })

  const albums = await db.album.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      cover: true
    }
  })

  const playlists = await db.playlist.findMany({
    take: 10,
    select: {
      id: true,
      name: true,
      cover: true
    }
  })

  return { artists, albums, playlists, user }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const props = await loader()

  return { props: { ...props, isCaching: false } }
}

type Props = {
  artists: { id: string; name: string; picture: string }[]
  albums: { id: string; name: string; cover: string }[]
  playlists: { id: string; name: string; cover: string }[]
}

const Index: VFC<Props> = ({ artists, albums, playlists }) => {
  return (
    <div className="container mx-auto min-h-screen">
      <h2 className="mt-24 text-5xl font-semibold text-white">Home</h2>
      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          Featured Artists
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {artists.map((artist) => (
            <div className="p-4" key={artist.id}>
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

      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          New Albums
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {albums.map((album) => (
            <div className="p-4" key={album.id}>
              <div>
                <Link href={`/album/${album.id}`} passHref>
                  <a>
                    <Image src={album.cover} width={250} height={250} />
                  </a>
                </Link>
              </div>

              <div>
                <Link href={`/album/${album.id}`} passHref>
                  <a className="font-semibold block hover:text-white mt-2">
                    {album.name}
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          Featured Playlists
        </h3>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Index
