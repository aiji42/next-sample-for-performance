import React, { VFC } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import 'tailwindcss/tailwind.css'
import { Playlist, User } from '@prisma/client'
import Cookies from 'js-cookie'

const MyApp: VFC<AppProps> = ({ Component, pageProps }) => {
  const cacheableToggle = async () => {
    Cookies.set('cacheable', `${!pageProps.isCaching}`)
    document.location.reload()
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <div className="bg-black relative">
        <div className="flex flex-col h-screen text-sm text-gray-400">
          <div className="flex-1 flex overflow-y-hidden">
            <SideBar user={pageProps.user ?? { playlists: [] }} />
            <div className="bg-gray-800-spotify flex-1 flex flex-col">
              <TopBar user={pageProps.user ?? { name: '' }} />
              <div
                className="content-spotify overflow-y-auto px-4"
                style={{ backgroundColor: '#181818' }}
              >
                <div className="container mx-auto">
                  <Component {...pageProps} />
                </div>
                <button
                  title={`Change to ${!pageProps.isCaching ? 'SSG' : 'SSR'}`}
                  onClick={cacheableToggle}
                  className="absolute bottom-0 right-0 m-8 rounded-full py-3 px-6 bg-purple-600 text-white"
                >
                  Now {pageProps.isCaching ? 'SSG' : 'SSR'} mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyApp

const SideBar: VFC<{ user: User & { playlists: Playlist[] } }> = ({ user }) => {
  return (
    <div className="sidebar bg-gray-900-spotify w-48 flex-none flex flex-col font-semibold">
      <ul className="py-6">
        <li className="border-l-4 border-green-600">
          <Link href="/" passHref>
            <a className="flex items-center mx-4 mt-4 group">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-current text-white group-hover:text-white h-6 w-6"
              >
                <path d="M13 20v-5h-2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-7.59l-.3.3a1 1 0 11-1.4-1.42l9-9a1 1 0 011.4 0l9 9a1 1 0 01-1.4 1.42l-.3-.3V20a2 2 0 01-2 2h-3a2 2 0 01-2-2zm5 0v-9.59l-6-6-6 6V20h3v-5c0-1.1.9-2 2-2h2a2 2 0 012 2v5h3z" />
              </svg>
              <span className="ml-2 text-white group-hover:text-white">
                Home
              </span>
            </a>
          </Link>
        </li>
        <li className="border-l-4 border-transparent">
          <a
            href="#"
            className="flex items-center hover:text-white mx-4 mt-4 group"
          >
            <svg
              width="24"
              height="24"
              className="fill-current text-gray-400 h-6 w-6 group-hover:text-white"
            >
              <path fill="none" d="M15 5.414V7h1.586z" />
              <path fill="none" d="M14 9a1 1 0 01-1-1V4H9v12h9V9h-4z" />
              <path d="M20 17V8h-.009a.996.996 0 00-.284-.707l-5-5A.99.99 0 0014 2.01V2H8a1 1 0 00-1 1v14a1 1 0 001 1h11a1 1 0 001-1zM15 5.414L16.586 7H15V5.414zM9 16V4h4v4a1 1 0 001 1h4v7H9z" />
              <path d="M3 8v13a1 1 0 001 1h12v-2H5V8H3z" />
            </svg>
            <span className="ml-2 group-hover:text-white">Browse</span>
          </a>
        </li>
        <li className="border-l-4 border-transparent">
          <a
            href="#"
            className="flex items-center hover:text-white mx-4 mt-4 group"
          >
            <svg
              viewBox="0 0 24 24"
              className="fill-current text-gray-400 h-6 w-6 group-hover:text-white"
            >
              <g data-name="Layer 2">
                <g data-name="radio">
                  <path d="M12 8a3 3 0 00-1 5.83 1 1 0 000 .17v6a1 1 0 002 0v-6a1 1 0 000-.17A3 3 0 0012 8zm0 4a1 1 0 111-1 1 1 0 01-1 1zM3.5 11a6.87 6.87 0 012.64-5.23 1 1 0 10-1.28-1.54A8.84 8.84 0 001.5 11a8.84 8.84 0 003.36 6.77 1 1 0 101.28-1.54A6.87 6.87 0 013.5 11z" />
                  <path d="M16.64 6.24a1 1 0 00-1.28 1.52A4.28 4.28 0 0117 11a4.28 4.28 0 01-1.64 3.24A1 1 0 0016 16a1 1 0 00.64-.24A6.2 6.2 0 0019 11a6.2 6.2 0 00-2.36-4.76zM8.76 6.36a1 1 0 00-1.4-.12A6.2 6.2 0 005 11a6.2 6.2 0 002.36 4.76 1 1 0 001.4-.12 1 1 0 00-.12-1.4A4.28 4.28 0 017 11a4.28 4.28 0 011.64-3.24 1 1 0 00.12-1.4z" />
                  <path d="M19.14 4.23a1 1 0 10-1.28 1.54A6.87 6.87 0 0120.5 11a6.87 6.87 0 01-2.64 5.23 1 1 0 001.28 1.54A8.84 8.84 0 0022.5 11a8.84 8.84 0 00-3.36-6.77z" />
                </g>
              </g>
            </svg>
            <span className="ml-2 group-hover:text-white2">Radio</span>
          </a>
        </li>
      </ul>
      <div className="sidebar-spotify px-5 mt-2">
        <h3 className="uppercase tracking-widest text-gray-500 font-normal text-xs">
          Library
        </h3>
        <ul className="leading-extra-loose">
          <li className="truncate">
            <Link href="/artist" passHref>
              <a className="hover:text-white">Artists</a>
            </Link>
          </li>
          <li className="truncate">
            <Link href="/album" passHref>
              <a className="hover:text-white">Albums</a>
            </Link>
          </li>
          <li className="truncate">
            <a href="#" className="hover:text-white">
              Liked Songs
            </a>
          </li>
          <li className="truncate">
            <Link href="/playlist" passHref>
              <a className="hover:text-white">Playlists</a>
            </Link>
          </li>
        </ul>
        <h3 className="uppercase tracking-widest text-gray-500 font-normal text-xs mt-6">
          Playlists
        </h3>
        <ul className="leading-extra-loose mb-6">
          {user.playlists.map(({ id, name }) => (
            <li className="truncate" key={id}>
              <Link href={`/playlist/${id}`} passHref>
                <a className="hover:text-white">{name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const TopBar: VFC<{ user: User }> = ({ user }) => {
  return (
    <div className="top-bar flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        <button>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-current text-gray-400 hover:text-white h-10 w-10"
          >
            <path d="M14.7 15.3a1 1 0 01-1.4 1.4l-4-4a1 1 0 010-1.4l4-4a1 1 0 011.4 1.4L11.42 12l3.3 3.3z" />
          </svg>
        </button>
        <button className="ml-1">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-current text-gray-400 hover:text-white h-10 w-10"
          >
            <path
              d="M9.3 8.7a1 1 0 011.4-1.4l4 4a1 1 0 010 1.4l-4 4a1 1 0 01-1.4-1.4l3.29-3.3-3.3-3.3z"
              className="heroicon-ui"
            />
          </svg>
        </button>
        <div className="ml-4 relative">
          <input
            placeholder="Search"
            className="bg-white text-gray-800 placeholder-gray-800 rounded-full px-3 pl-8 py-1"
          />
          <div className="absolute top-0">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="fill-current text-gray-800 h-6 w-6 pt-1 pl-2"
            >
              <path
                d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12z"
                className="heroicon-ui"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button>
          <svg
            viewBox="0 0 496 512"
            className="fill-current text-gray-400 hover:text-white w-6 h-6"
          >
            <path d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z" />
          </svg>
        </button>
        <a href="#" className="ml-2 hover:underline hover:text-white">
          {user.name}
        </a>
        <button className="ml-4">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-current text-gray-400 hover:text-white w-6 h-6"
          >
            <path
              d="M15.3 9.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4l3.3 3.29 3.3-3.3z"
              className="heroicon-ui"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
