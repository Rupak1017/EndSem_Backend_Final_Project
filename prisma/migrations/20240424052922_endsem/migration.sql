-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
