const User = require('../dao/models/user.model');
const sendMail = require('../utils/mailer');

class UserController {

    async changeUserRole(req, res) {
                try {

                    const userId = req.params.uid;
                    const newRole = req.body.role;

                    if (newRole !== 'user' && newRole !== 'premium' && newRole !== 'admin') {
                        throw new Error('Rol inválido. Debe ser "user", "premium" o "admin"');
                    }
        
                    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        
                    if (!updatedUser) {
                        throw new Error('Usuario no encontrado');
                    }
        
                    res.redirect('/users/admin');
                } catch (error) {
                    res.status(500).json({ message: error.message });
                }
            }


    async deleteUser(req, res) {
        try {
            const userId = req.params.uid;

            await this.deleteUserById(userId);
            res.redirect('/users/admin');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteInactiveUsers(req, res) {
        try {

            const inactiveUsers = await User.find({ lastConnection: { $lt: new Date(Date.now() - 30 * 60 * 1000) } });

            for (let user of inactiveUsers) {
                await sendMail(
                    user.email,
                    'Cuenta eliminada por inactividad',
                    'Tu cuenta ha sido eliminada por inactividad.'
                );

                await User.deleteOne({ _id: user._id });
            }

            res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
        }
    }

    async adminView(req, res) {
        try {
            const users = await User.find({}).lean();

            users.forEach(user => {
                user.isUserRole = user.role === 'user';
                user.isAdminRole = user.role === 'admin';
            });

            res.render('usersAdmin', { users });
        } catch (error) {
            res.status(500).json({ message: 'Error al cargar la vista de administración de usuarios' });
        }
    }

    async deleteUserById(userId) {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                throw new Error('Usuario no encontrado');
            }

            return deletedUser;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers(req, res) {
        try{
            const users = await User.find({}, 'name email role');
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios'})
        }
     }
}

module.exports = { UserController };
