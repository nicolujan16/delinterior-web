import React from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, MousePointerClick, ArrowRightLeft, Clock, Download, BarChart, PieChart, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  Pie,
  Cell,
} from 'recharts';

const StatCard = ({ icon: Icon, title, value, change, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const lineChartData = [
  { name: 'Lun', visitas: 2390 }, { name: 'Mar', visitas: 3490 }, { name: 'Mié', visitas: 2000 },
  { name: 'Jue', visitas: 2780 }, { name: 'Vie', visitas: 1890 }, { name: 'Sáb', visitas: 4800 },
  { name: 'Dom', visitas: 4300 },
];

const barChartData = [
  { name: 'Ruta del Vino', leidos: 4000 }, { name: 'Debate energético', leidos: 3000 },
  { name: 'Chats de Fernández', leidos: 2000 }, { name: 'Normas BCRA', leidos: 2780 },
  { name: 'Infancias Cuidadas', leidos: 1890 },
];

const pieChartData = [
  { name: 'Google', value: 400 }, { name: 'Redes Sociales', value: 300 },
  { name: 'Directo', value: 300 }, { name: 'Referidos', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exportación iniciada (simulado)",
      description: "La descarga de tu archivo CSV comenzará en breve.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
          <p className="text-gray-600 mt-1">Un resumen del rendimiento de tu portal.</p>
        </div>
        <div className="flex gap-2">
          <Tabs defaultValue="30d" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="7d">7 días</TabsTrigger>
              <TabsTrigger value="30d">30 días</TabsTrigger>
              <TabsTrigger value="90d">90 días</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} title="Visitas Totales" value="12,234" change="+20.1% desde el mes pasado" delay={0.1} />
        <StatCard icon={Eye} title="Visitas Únicas" value="8,741" change="+15.3% desde el mes pasado" delay={0.2} />
        <StatCard icon={MousePointerClick} title="Artículos Leídos" value="34,591" change="+8.9% desde el mes pasado" delay={0.3} />
        <StatCard icon={Clock} title="Tiempo Promedio" value="3m 15s" change="-2.1% desde el mes pasado" delay={0.4} />
        <StatCard icon={Users} title="Usuarios Activos" value="128" change="En tiempo real" delay={0.5} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5" /> Visitas en el Tiempo</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={lineChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitas" stroke="#2563eb" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" /> Fuentes de Tráfico</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" /> Artículos más Leídos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={barChartData} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="leidos" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;