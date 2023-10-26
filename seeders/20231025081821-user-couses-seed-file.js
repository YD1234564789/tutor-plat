'use strict';
const { Teacher_info } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢所有的教師資訊
    const teacherInfos = await Teacher_info.findAll({ raw: true });
    const Courses = []
    const userIds = [68, 69, 70, 71, 72, 73]
    const coursesPerUser = 2
      for (const userID of userIds) {
        for (let i = 0; i< coursesPerUser; i++) {
          // 隨機選擇一個教師資訊
          const randomTeacherInfo = teacherInfos[Math.floor(Math.random() * teacherInfos.length)];
          // 假設教師可預約的日期、時段等信息
          const date  = JSON.parse(randomTeacherInfo.date)
          const { startTime, endTime, duration } = randomTeacherInfo

          // 隨機選擇日期（星期幾）
          const randomDate = date[Math.floor(Math.random() * date.length)];

          // 計算可安排課程數
          const durationToHour = duration / 60
          const numCourses = (endTime-startTime)/durationToHour
          // 隨機選擇時段
          const randomStartTime = Math.floor(Math.random() * numCourses)+ startTime
          const randomEndTime = randomStartTime + durationToHour

          // 生成 course 資料
          const courseData = {
            start_time: randomStartTime,
            end_time: randomEndTime,
            date: randomDate,
            rate: Math.round(Math.random() * 5 * 10) / 10,
            is_done: false,
            user_id: userID,
            teacher_info_id: randomTeacherInfo.id,
            created_at: new Date(),
            updated_at: new Date()
          }
          Courses.push(courseData)
        }
      }

    await queryInterface.bulkInsert('Couses', Courses)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Couses', {})
  }
};

// 68~73 user