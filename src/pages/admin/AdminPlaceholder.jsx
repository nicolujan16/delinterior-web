import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPlaceholder = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center py-20"
    >
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Wrench className="w-12 h-12 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Esta sección está en construcción. ¡Vuelve pronto para ver las novedades!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Puedes solicitar la implementación de esta funcionalidad en tu próximo prompt.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminPlaceholder;