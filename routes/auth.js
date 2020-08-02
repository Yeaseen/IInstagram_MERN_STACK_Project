const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


require("dotenv").config()
const requireLogin = require('../middleWare/requireLogin')


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.post('/signup', (req, res) => {
    const { name, email, password, propic } = req.body

    if (!email || !name || !password) {
        return res.status(422).json({ error: "please fill all the fields" })
    }


    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exits with given email id :( " })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic: propic
                    })
                    user.save()
                        .then(user => {

                            const msg = {
                                to: user.email,
                                from: process.env.SENDGRID_EMAIL,
                                subject: 'Do not reply this mail',
                                html: '<h1>Welcome to IInstagram</h1>',
                            };

                            sgMail.send(msg);

                            res.json({ message: "saved user successfully ^_^" })
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "Successfully signed in" })

                        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)
                        const { _id, name, email } = savedUser
                        res.json({ token, user: { _id, name, email } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})


router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }

        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User doesnt exists with given email" })
                }

                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.markModified('resetToken')
                user.markModified('expireToken')
                user.save().then((result) => {
                    const msg = {
                        to: user.email,
                        from: process.env.SENDGRID_EMAIL,
                        subject: 'Password Reset',
                        html: `
                        <p>You have requested for password reset</p>
                        <h5>click in this <a href="${process.env.HOSTEDLOCALHOST}/reset/${token}">link</a> to reset password</h5>
                        `
                    }
                    sgMail.send(msg)

                    res.json({ message: "check your mail" })
                })
            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again! Session may expired" })
            }

            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.markModified('password')
                user.markModified('resetToken')
                user.markModified('expireToken')
                user.save().then((saveduser) => {
                    res.json({ message: "password updated successfully" })
                })
            })

        }).catch(err => {
            console.log(err)
        })
})

module.exports = router