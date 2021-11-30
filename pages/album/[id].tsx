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

  const { data: album } = await supabase()
    .from('Album')
    .select(
      'name, cover, Song (id, name, length, Interaction (playCount)), _AlbumToArtist (Artist (id, name)))'
    )
    .match({ id })
    .single()

  const { data: user } = await userPromise
  return { album, user }
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
  album: {
    name: string
    cover: string
    _AlbumToArtist: {
      Artist: { id: string; name: string }
    }[]
    Song: {
      id: string
      name: string
      length: number
      Interaction: { playCount: number }[]
    }[]
  }
}

const Album: VFC<Prop> = ({ album }) => {
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <Head>
        <title>{album.name} | Albums | Remix Sample</title>
      </Head>
      <div className="flex">
        <div className="mr-6">
          <Image priority src={album.cover} width={300} height={300} />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="mt-0 mb-2 uppercase text-gray-500 tracking-widest text-xs">
            Album
          </h4>
          <h1 className="mt-0 mb-2 text-white text-4xl">{album.name}</h1>

          <p className="text-gray-600 text-sm">
            Created by{' '}
            {album._AlbumToArtist.map(({ Artist: { id, name } }) => (
              <Link href={`/artist/${id}`} key={id} passHref>
                <a className="hover:underline">{name}</a>
              </Link>
            ))}{' '}
            - {album.Song.length} songs,{' '}
            {timeFormattedString(
              album.Song.reduce((res, { length }) => res + length, 0)
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
          <div className="p-2 w-full">Played</div>
          <div className="p-2 w-12 flex-shrink-0 text-right">⏱</div>
        </div>
        {album.Song.map((song) => (
          <div
            key={song.id}
            className="flex border-b border-gray-800 hover:bg-gray-800"
          >
            <div className="p-3 w-8 flex-shrink-0">▶️</div>
            <div className="p-3 w-full">{song.name}</div>
            <div className="p-3 w-full">
              {song.Interaction.reduce(
                (res, { playCount }) => res + playCount,
                0
              ).toLocaleString()}
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

export default Album
