import { withIronSessionApiRoute } from "iron-session/next"
import sessionOptions from "../../config/session"
import db from '../../db'

export default withIronSessionApiRoute(
  async function handler(req, res) {
    
    if (!req.session.user) {
      return res.status(401).json({ error: "Cannot find user" })
    }
    const userId = req.session.user.id

    switch (req.method) {
      case 'POST':
        try {
          const book = req.body
          const addBook = await db.book.add(userId, book)
          if (!addBook) {
            req.session.destroy()
            return res.status(401).json({ error: "Book failed to be added" })
          }
          return res.status(200).json(addBook)
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }

      case 'DELETE':
        try {
          const bookId = req.body.id
          const deleteBook = await db.book.remove(userId, bookId)
          if (!deleteBook) {
            req.session.destroy()
            return res.status(401).json({ error: "Book failed to be removed" })
          }
          return res.status(200).json({ book: deleteBook })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }

      default:
        return res.status(404).end()
    }
  },
  sessionOptions
)

    // TODO: On a POST request, add a book using db.book.add with request body 
    // TODO: On a DELETE request, remove a book using db.book.remove with request body 
    // TODO: Respond with 404 for all other requests
    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in
  
