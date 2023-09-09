-- CreateTable
CREATE TABLE `subjects` (
    `subject_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `num_credits` INTEGER NOT NULL,

    UNIQUE INDEX `subjects_name_key`(`name`),
    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `class_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `academic_year` INTEGER NOT NULL,

    UNIQUE INDEX `classes_name_key`(`name`),
    UNIQUE INDEX `classes_name_academic_year_key`(`name`, `academic_year`),
    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `mssv` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`mssv`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scores` (
    `score_id` VARCHAR(191) NOT NULL,
    `score` DECIMAL(65, 30) NOT NULL,
    `mssv` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `scores_mssv_subject_id_key`(`mssv`, `subject_id`),
    PRIMARY KEY (`score_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_mssv_fkey` FOREIGN KEY (`mssv`) REFERENCES `students`(`mssv`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
