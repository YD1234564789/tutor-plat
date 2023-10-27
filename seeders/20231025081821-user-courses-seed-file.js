'use strict';
const { Teacher_info, User } = require('../models')
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 預設UserId後5位為學生
    const users = await User.findAll({
      order: [['id', 'DESC']],
      limit: 5,
      raw: true
    })
    // 查詢所有的教師資訊
    const teacherInfos = await Teacher_info.findAll();
    const coursesPerUser = 2
    const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min +1)) + min

    // 1.學生 已完成 未評分 各2個
    for (const user of users) {
        for (let i = 0; i< coursesPerUser; i++) {
          // 隨機選擇一個教師資訊
          const randomTeacherInfo = teacherInfos[Math.floor(Math.random() * teacherInfos.length)]
          // 隨機選擇過去日期
          const mm = getRandomNum(0, 9)
          const dd = getRandomNum(0, 30)
          const randomDate = new Date(2023, mm, dd)
          // 計算可安排課程數
          const { startTime, endTime, duration } = randomTeacherInfo
          const durationToHour = duration / 60
          const numCourses = (endTime - startTime) / durationToHour
          // 隨機選擇開始時段
          const randomStartTime = Math.floor(Math.random() * numCourses)+ startTime
          const randomEndTime = randomStartTime + durationToHour
  
          // 生成 course 資料
          await queryInterface.bulkInsert('Courses', [
            {
              start_time: randomStartTime,
              end_time: randomEndTime,
              date: randomDate,
              rate: null,
              is_done: true,
              user_id: user.id,
              teacher_info_id: randomTeacherInfo.id,
              created_at: new Date(),
              updated_at: new Date()
            }
          ])
        }
    }
      

    // 2.老師 已完成 已評分 各2個
    for (const teacher of teacherInfos) {
      for (let i = 0; i < coursesPerUser; i++) {
        // 隨機userID
        const randomUser = users[Math.floor(Math.random() * users.length)]
        // 隨機選擇過去日期
        const mm = getRandomNum(0, 9)
        const dd = getRandomNum(0, 30)
        const randomDate = new Date(2023, mm, dd)
        // 計算可安排課程數
        const { startTime, endTime, duration } = teacher
        const durationToHour = duration / 60
        const numCourses = (endTime - startTime) / durationToHour
        // 隨機開始、結束時段
        const randomStartTime = Math.floor(Math.random() * numCourses) + startTime
        const randomEndTime = randomStartTime + durationToHour

        //生成 course 資料
        await queryInterface.bulkInsert('Courses', [
          {
            start_time: randomStartTime,
            end_time: randomEndTime,
            date: randomDate,
            rate: Math.round(Math.random() * 5 * 10) / 10,
            is_done: true,
            message: faker.lorem.sentence({ min:3, max: 7 }),
            user_id: randomUser.id,
            teacher_info_id: teacher.id,
            created_at: new Date(),
            updated_at: new Date()
          }
        ])
      }
    }

    // 3.老師 預約 未評分 各2個
    for (const teacher of teacherInfos) {
      for (let i = 0; i < coursesPerUser; i++) {
        // 隨機userID
        const randomUser = users[Math.floor(Math.random() * users.length)]
        // 隨機選擇未來日期
        const mm = getRandomNum(11, 12)
        const dd = getRandomNum(0, 30)
        const randomDate = new Date(2023, mm, dd)
        // 計算可安排課程數
        const { startTime, endTime, duration } = teacher
        const durationToHour = duration / 60
        const numCourses = (endTime - startTime) / durationToHour
        // 隨機開始、結束時段
        const randomStartTime = Math.floor(Math.random() * numCourses) + startTime
        const randomEndTime = randomStartTime + durationToHour

        // 生成 course 資料
        await queryInterface.bulkInsert('Courses', [
          {
            start_time: randomStartTime,
            end_time: randomEndTime,
            date: randomDate,
            rate: null,
            is_done: false,
            user_id: randomUser.id,
            teacher_info_id: teacher.id,
            created_at: new Date(),
            updated_at: new Date()
          }
        ])
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', {})
  }
};
