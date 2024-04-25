// models/course.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  Course: prisma.course
};
