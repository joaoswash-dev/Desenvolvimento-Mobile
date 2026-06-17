import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/utils/password.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seedando banco de dados...');

  // Limpar dados existentes
  await prisma.task.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários de teste
  const hashedPassword = await hashPassword('senha123');

  const user1 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      password: hashedPassword,
      name: 'João Silva',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      password: hashedPassword,
      name: 'Maria Santos',
    },
  });

  console.log('✅ Usuários criados com sucesso:');
  console.log(`   - ${user1.name} (${user1.email})`);
  console.log(`   - ${user2.name} (${user2.email})`);

  // Criar dispositivos para user1
  const device1 = await prisma.device.create({
    data: {
      name: 'Sensor Sala',
      location: 'Sala de Estar',
      type: 'climate',
      temperature: 23.5,
      humidity: 45,
      status: 'online',
      userId: user1.id,
    },
  });

  const device2 = await prisma.device.create({
    data: {
      name: 'Sensor Quarto',
      location: 'Quarto Principal',
      type: 'climate',
      temperature: 21.2,
      humidity: 50,
      status: 'online',
      userId: user1.id,
    },
  });

  const device3 = await prisma.device.create({
    data: {
      name: 'Sensor Cozinha',
      location: 'Cozinha',
      type: 'temperature',
      temperature: 26.8,
      status: 'online',
      userId: user1.id,
    },
  });

  console.log('\n✅ Dispositivos criados:');
  console.log(`   - ${device1.name} (${device1.location})`);
  console.log(`   - ${device2.name} (${device2.location})`);
  console.log(`   - ${device3.name} (${device3.location})`);

  // Criar tarefas para user1
  const task1 = await prisma.task.create({
    data: {
      title: 'Verificar temperatura da sala',
      completed: false,
      userId: user1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Revisar umidade do quarto',
      completed: false,
      userId: user1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Manutenção do sensor da cozinha',
      completed: true,
      userId: user1.id,
    },
  });

  console.log('\n✅ Tarefas criadas:');
  console.log(`   - ${task1.title} (${task1.completed ? '✅' : '⏳'})`);
  console.log(`   - ${task2.title} (${task2.completed ? '✅' : '⏳'})`);
  console.log(`   - ${task3.title} (${task3.completed ? '✅' : '⏳'})`);

  console.log('\n💡 Credenciais de teste:');
  console.log('   Email: joao@example.com');
  console.log('   Senha: senha123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao seedar banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
