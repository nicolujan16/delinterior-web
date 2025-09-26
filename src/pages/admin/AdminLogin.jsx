import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Firebase
import { auth } from '@/FirebaseConfig';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { useAuth } from '../../context/AuthProvider';
import { useEffect } from 'react';

const AdminLogin = () => {
  const navigate = useNavigate();

  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    // esperar a que termine de cargar el estado de auth
    if (authLoading) return;
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }


  }, [user, isAdmin, authLoading, navigate]);



  // estados para inputs y lógica
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // elegir persistence según checkbox
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

      // loguear con email/password
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);

      // forzar refresh del token para asegurarnos de las custom claims (si se usan)
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
      }

      // redirigir al dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      // mensajear error de forma simple
      const message = err?.code
        ? mapFirebaseAuthError(err.code)
        : err?.message || 'Error al iniciar sesión';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Mapea algunos códigos comunes a mensajes más amigables
  function mapFirebaseAuthError(code) {
    switch (code) {
      case 'auth/invalid-email':
        return 'El email no es válido.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return 'No se pudo iniciar sesión. Revisa tus credenciales.';
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <CardDescription>Inicia sesión para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={remember}
                  onCheckedChange={(val) => setRemember(Boolean(val))}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal">Recordar sesión</Label>
              </div>

              {/* mantuve el botón igual visualmente; lo deshabilito en loading */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Iniciar Sesión'}
              </Button>

              {/* Mensaje de error simple, sin alterar el layout */}
              {error && (
                <div className="text-sm text-red-600 mt-2" role="alert">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
