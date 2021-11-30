import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import {
  timeFormattedString,
  timeFormattedStringShort
} from '../../utils/formatter'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'

export const loader = async (id: string) => {
  const supabase = () =>
    createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_API_KEY ?? '',
      {
        fetch
      }
    )

  const userPromise = supabase()
    .from('User')
    .select('name, Playlist (id, name)')
    .limit(1)
    .single()

  const { data: playlist } = await supabase()
    .from('Playlist')
    .select(
      'name, cover, User (name), _PlaylistToSong (Song (id, name, length, Album (id, name), Artist (id, name))))'
    )
    .match({ id })
    .limit(1)
    .single()

  const { data: user } = await userPromise
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
    User: {
      name: string
    }
    _PlaylistToSong: {
      Song: {
        id: string
        name: string
        length: number
        Album?: {
          id: string
          name: string
        } | null
        Artist: {
          id: string
          name: string
        }
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
            Created by <a>{playlist.User.name}</a> -{' '}
            {playlist._PlaylistToSong.length} songs,{' '}
            {timeFormattedString(
              playlist._PlaylistToSong.reduce(
                (res, { Song: { length } }) => res + length,
                0
              )
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
        {playlist._PlaylistToSong.map(({ Song: song }) => (
          <div
            key={song.id}
            className="flex border-b border-gray-800 hover:bg-gray-800"
          >
            <div className="p-3 w-8 flex-shrink-0">▶️</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">
              <Link href={`/artist/${song.Artist.id}`} passHref>
                <a className="hover:underline">{song.Artist.name}</a>
              </Link>
            </div>
            <div className="p-3 w-full">
              <Link href={`/album/${song.Album?.id}`}>
                <a className="hover:underline">{song.Album?.name}</a>
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
