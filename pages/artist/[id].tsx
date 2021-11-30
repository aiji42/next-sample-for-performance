import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { timeFormattedStringShort } from '../../utils/formatter'
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

  const { data: artist } = await supabase()
    .from('Artist')
    .select(
      'name, picture, Song (id, name, length, Interaction (playCount)), _AlbumToArtist (Album (id, name, cover, createdAt))'
    )
    .match({ id })
    .limit(1)
    .single()

  const { data: user } = await userPromise
  return { artist, user }
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
  artist: {
    name: string
    picture: string
    _AlbumToArtist: {
      Album: { id: string; name: string; cover: string; createdAt: string }
    }[]
    Song: {
      id: string
      name: string
      Interaction: { playCount: number }[]
      length: number
    }[]
  }
}

const Artist: VFC<Prop> = ({ artist }) => {
  return (
    <div className="text-gray-300 min-h-screen p-10">
      <Head>
        <title>{artist.name} | Artists | Remix Sample</title>
      </Head>
      <div
        className="bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${artist.picture})` }}
      >
        <div className="relative w-full h-full bg-opacity-50 bg-gray-800">
          <div className="absolute inset-x-0 bottom-0 pl-8 pb-4 flex flex-col justify-center">
            <h4 className="mt-0 mb-2 uppercase text-white tracking-widest text-xs">
              Artist
            </h4>
            <h1 className="mt-0 mb-2 text-white text-4xl">{artist.name}</h1>
          </div>
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
        {artist.Song.slice(0, 5).map((song) => (
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

      <div className="mt-12">
        <h3 className="font-semibold text-xl border-b border-gray-900 pb-2">
          Albums
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {artist._AlbumToArtist.map(({ Album: album }) => (
            <div className="p-4" key={album.id}>
              <div>
                <Link href={`/album/${album.id}`} prefetch>
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
    </div>
  )
}

export default Artist
