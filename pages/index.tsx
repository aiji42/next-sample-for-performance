import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'

export const loader = async () => {
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

  const artistPromise = supabase()
    .from('Artist')
    .select('id, name, picture')
    .limit(5)

  const albumsPromise = supabase()
    .from('Album')
    .select('id, name, cover')
    .limit(5)

  const playlistsPromise = supabase()
    .from('Playlist')
    .select('id, name, cover')
    .limit(10)

  const { data: user } = await userPromise
  const { data: artists } = await artistPromise
  const { data: albums } = await albumsPromise
  const { data: playlists } = await playlistsPromise

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
      <Head>
        <title>Home | Remix Sample</title>
      </Head>
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
