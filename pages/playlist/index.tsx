import React, { VFC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'

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

  const { data: playlists } = await supabase()
    .from('Playlist')
    .select('id, name, cover')

  const { data: user } = await userPromise
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
