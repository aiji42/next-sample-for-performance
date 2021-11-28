import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'
import { GetServerSideProps } from 'next'
import {
  timeFormattedString,
  timeFormattedStringShort
} from '../../utils/formatter'
import Head from 'next/head'

export const loader = async (id: string) => {
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

  const playlist = await db.playlist.findUnique({
    where: {
      id
    },
    select: {
      name: true,
      cover: true,
      user: {
        select: {
          name: true
        }
      },
      songs: {
        select: {
          id: true,
          name: true,
          length: true,
          album: {
            select: {
              id: true,
              name: true
            }
          },
          artist: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  return { playlist, user }
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id
  if (typeof id !== 'string')
    return {
      notFound: true
    }
  const props = await loader(id)

  return { props: { ...props, isCaching: false } }
}

type Prop = {
  playlist: {
    name: string
    cover: string
    user: {
      name: string
    }
    songs: {
      id: string
      name: string
      length: number
      album: {
        id: string
        name: string
      } | null
      artist: {
        id: string
        name: string
      }
    }[]
  }
}

const Playlist: VFC<Prop> = ({ playlist }) => {
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <Head>
        <title>{playlist.name} | Playlists | Remix Sample</title>
      </Head>
      <div className="flex">
        <div className="mr-6">
          <Image priority src={playlist.cover} height={300} width={300} />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Playlist
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{playlist.name}</h1>

          <p className="text-gray-600 text-sm">
            Created by <a>{playlist.user.name}</a> - {playlist.songs.length}{' '}
            songs,{' '}
            {timeFormattedString(
              playlist.songs.reduce((res, { length }) => res + length, 0)
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex">
          <button className="mr-2 bg-green-500 text-green-100 block py-2 px-8 rounded-full">
            Play
          </button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex text-gray-600">
          <div className="p-2 w-8 flex-shrink-0" />
          <div className="p-2 w-full">Title</div>
          <div className="p-2 w-full">Artist</div>
          <div className="p-2 w-full">Album</div>
          <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
        </div>
        {playlist.songs.map((song) => (
          <div
            key={song.id}
            className="flex border-b border-gray-800 hover:bg-gray-800"
          >
            <div className="p-3 w-8 flex-shrink-0">▶️</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">
              <Link href={`/artist/${song.artist.id}`} passHref>
                <a className="hover:underline">{song.artist.name}</a>
              </Link>
            </div>
            <div className="p-3 w-full">
              <Link href={`/album/${song.album?.id}`}>
                <a className="hover:underline">{song.album?.name}</a>
              </Link>
            </div>
            <div className="p-3 w-12 flex-shrink-0 text-right">
              {timeFormattedStringShort(song.length)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Playlist
