import { PrismaClient } from '@prisma/client'
import faker from 'faker'

const prisma = new PrismaClient()

const MAX_NUMBER_OF_SONGS_PER_ARTIST = 10
const NUMBER_OF_ARTISTS = 10
const NUMBER_OF_USERS = 10

const userIds = Array.from({
  length: NUMBER_OF_USERS
}).map(() => faker.datatype.uuid())

async function main() {
  // Create artists
  await prisma.artist.createMany({
    data: Array.from({ length: NUMBER_OF_ARTISTS }).map((_, index) => ({
      name: faker.name.firstName(),
      picture: `/artist-${index}.jpg`
    }))
  })

  const artists = await prisma.artist.findMany()

  // Create songs for each artist
  for (const artist of artists) {
    await Promise.all(
      Array.from({ length: faker.datatype.number({ min: 5, max: 10 }) }).map(
        () =>
          prisma.album.create({
            data: {
              cover: `https://picsum.photos/seed/${faker.random.word()}/500/500`,
              name: faker.random.words(
                faker.datatype.number({ min: 2, max: 3 })
              ),
              artists: {
                connect: {
                  id: artist.id
                }
              },
              songs: {
                create: Array.from({
                  length: faker.datatype.number({
                    min: 2,
                    max: MAX_NUMBER_OF_SONGS_PER_ARTIST
                  })
                }).map(() => ({
                  artistId: artist.id,
                  fileUrl: faker.internet.url(),
                  length: faker.datatype.float({ min: 30, max: 480 }),
                  name: faker.random.words(
                    faker.datatype.number({ min: 2, max: 3 })
                  )
                }))
              }
            }
          })
      )
    )
  }

  // Create songs
  const songs = await prisma.song.findMany()

  for (const userId of userIds) {
    // Create users
    await prisma.user.create({
      data: {
        id: userId,
        email: faker.internet.email(),
        name: faker.name.firstName(),
        interactions: {
          create: Array.from({
            length: faker.datatype.number({
              min: 3,
              max: songs.length
            })
          }).map(() => ({
            playCount: faker.datatype.number({ min: 1, max: 1000 }),
            songId:
              songs[faker.datatype.number({ min: 0, max: songs.length - 1 })]
                .id,
            // random boolean
            isLiked: Math.random() < 0.5
          }))
        }
      }
    })

    // Create Playlists
    await Promise.all(
      Array.from({
        length: faker.datatype.number({ min: 5, max: 10 })
      }).map(() =>
        prisma.playlist.create({
          data: {
            name: faker.random.words(2),
            user: {
              connect: {
                id: userId
              }
            },
            // each playlist will have a random list of songs
            songs: {
              connect: shuffle(songs)
                .slice(0, faker.datatype.number({ min: 10, max: 30 }))
                .map(({ id }) => ({ id }))
            },
            cover: `https://picsum.photos/seed/${faker.random.word()}/500/500`
          }
        })
      )
    )
  }
}

main().finally(async () => {
  await prisma.$disconnect()
})

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
