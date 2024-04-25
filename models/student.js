// models/student.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Student = prisma.student;

module.exports = { Student };
