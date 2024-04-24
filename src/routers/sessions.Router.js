const express = require('express');
const router = express.Router();
const User = require('../../dao/models/user.model')


router.post('/login', async (req, res) => {
    const { email, password} = req.body
    if (!email || !password){
        return res.status(400).json({ error: 'datos Invalidos'})
    }
    const user = await User.findOne({ email, password})
    if(!user){
        return res.status(400).json({error: 'No se encontro el usuario'})
    }

    req.session.user = { email, _id: user._id.toString()}
    res.redirect('/')
})

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const user = new User({
            firstName,
            lastName,
            age,
            email,
            password
        });

        await user.save();
        /* req.session.user = {email, id:user.id.toString()} */

        res.redirect('/');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = router;
