import jwt from "jsonwebtoken"
import prisma from "./prisma.js"

// uztanovka accesToken
export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TTL
  })
}

// uztanovka refreshToken
export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TTL
  })
}

export function signResetToken(payload) {
  return jwt.sign(payload, process.env.RESET_TOKEN, {
    expiresIn: process.env.RESET_TTL // 5m
  })
}

// nastroyka refresh token
export function setRefreshCookie(res, refresh_token) {
  res.cookie('refreshToken', refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/api/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
}


// pri obnovleniye stranitsi
export async function updatePage(req, res) {

  try {

    const token = req.cookies.refreshToken
    console.log(token)
    if(!token) return res.status(401).json({success: false, message: 'unAuthorized'})

    const payload     = jwt.verify(token, process.env.REFRESH_TOKEN)
    const userId      = payload.userId
    const accessToken = signAccessToken({userId})

    const user = await prisma.user.findUnique({ where: {id: userId}, select: { id: true, name: true, email: true, createdAt: true } })
    const settings = await prisma.userSettings.findUnique({where: {userId: userId}, select: {language: true , startPage: true, confirmDelete: true}})
    
    if(!user || !settings) return res.status(401).json({success: false, message: 'User or Settings Not Found'})
    
    return res.json({success: true, accessToken, user, settings})

  } catch(err) {
    console.log(err.message)
    res.status(401).json({success: false, message: 'invalidRefreshToken'})
  }
}