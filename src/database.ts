import typeorm from 'typeorm';
const { createConnection } = typeorm;

export const connectDB = async () => {
  await createConnection();
};
