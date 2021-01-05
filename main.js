const fs = require('fs')

class Command {
  constructor(name, params) {
    this.name = name
    this.params = params
  }
}

function main() {
  const filename = 'input.txt'
  const commands = getCommandsFromFileName(filename)

  const rooms = []
  const keycards = []
  var bookings = []

  commands.forEach((command) => {
    switch (command.name) {
      case 'create_hotel':
        var [floor, roomPerFloor] = command.params

        for (let i = 1; i <= floor; i++) {
          for (let j = 1; j <= roomPerFloor; j++) {
            rooms.push(parseInt(`${i}${j.toString().padStart(2, '0')}`))
            keycards.push(keycards.length + 1)
          }
        }

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        )
        return

      case 'book':
        var [room, guestName, guestAge] = command.params

        if (!rooms.includes(room)) {
          console.log(
            `Cannot book room ${room} for ${guestName}, The room is not exists.`
          )
          return
        }

        var currentBooking = bookings.find((booking) => booking.room === room)

        if (currentBooking) {
          console.log(
            `Cannot book room ${room} for ${guestName}, The room is currently booked by ${currentBooking.guestName}.`
          )
          return
        }

        var keycard = keycards.find(
          (keycard) => !bookings.find((booking) => booking.keycard === keycard)
        )
        bookings.push({ room, guestName, guestAge, keycard })

        console.log(
          `Room ${room} is booked by PeterParker with keycard number ${keycard}.`
        )
        return

      case 'checkout':
        var [keycard, guestName] = command.params

        var currentBooking = bookings.find(
          (booking) => booking.keycard === keycard
        )

        if (!currentBooking) {
          console.log(`No one using keycard number ${currentBooking.keycard}.`)
          return
        }

        if (currentBooking.guestName !== guestName) {
          console.log(
            `Only ${currentBooking.guestName} can checkout with keycard number ${currentBooking.keycard}.`
          )
          return
        }

        bookings = bookings.filter((booking) => booking.keycard !== keycard)
        console.log(`Room ${currentBooking.room} is checkout.`)
        return

      case 'list_available_rooms':
        const avariableRooms = rooms.filter(
          (room) => !bookings.find((booking) => booking.room === room)
        )

        if (avariableRooms.length) {
          console.log(avariableRooms.join(', '))
        } else {
          console.log('No any avariable room.')
        }

        return

      case 'list_guest':
        if (bookings.length) {
          const guests = bookings.map((booking) => booking.guestName)
          console.log(guests.join(', '))
        } else {
          console.log('No any guest.')
        }

        return

      case 'list_guest_by_age':
        var [operator, age] = command.params
        const guestBookings = bookings.filter((booking) =>
          eval(`${booking.guestAge} ${operator} ${age}`)
        )

        if (guestBookings.length) {
          const guests = guestBookings.map((booking) => booking.guestName)
          console.log(guests.join(', '))
        } else {
          console.log(`No any guest that age ${operator} ${age}.`)
        }

        return

      case 'get_guest_in_room':
        var [room] = command.params

        var currentBooking = bookings.find((booking) => booking.room === room)

        if (currentBooking) {
          console.log(currentBooking.guestName)
        } else {
          console.log(`No one book ${room}.`)
        }

        return

      default:
        return
    }
  })
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, 'utf-8')

  return file
    .split('\n')
    .map((line) => line.split(' '))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10)

            return Number.isNaN(parsedParam) ? param : parsedParam
          })
        )
    )
}

main()
