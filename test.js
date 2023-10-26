const { User, Teacher_info, Couse } = require('./models'); // 請根據您的模組路徑進行調整

// 定義 Seeder 函數
async function seedCourses () {
    // 查詢所有的教師資訊
    const teacherInfos = await Teacher_info.findAll();

    const generatedCourses = Array.from({ length: 16 }).map(() => {
      // 隨機選擇一個教師資訊
      const randomTeacherInfo = teacherInfos[Math.floor(Math.random() * teacherInfos.length)];

      // 假設教師可預約的日期、時段等信息
      const { date, start_time, end_time, duration } = randomTeacherInfo;

      // 隨機選擇日期（星期幾）
      const randomDate = date[Math.floor(Math.random() * date.length)];

      // 隨機選擇時段
      const randomStartTime = Math.floor(Math.random() * (end_time - start_time - (duration/60)) + start_time);
      const randomEndTime = randomStartTime + duration;

      // 檢查是否已被預約
      const isAlreadyReserved = await Couse.findOne({
        where: {
          date: randomDate,
          start_time: randomStartTime,
          teacher_info_id: randomTeacherInfo.id,
        },
      });

      if (!isAlreadyReserved) {
        // 生成 course 資料
        return {
          start_time: randomStartTime,
          end_time: randomEndTime,
          date: randomDate,
          rate: 0, // 填入適當的評分
          is_done: false,
          user_id: randomTeacherInfo.user_id,
          teacher_info_id: randomTeacherInfo.id,
        };
      }
    });

    // 移除為空的元素
    const courses = generatedCourses.filter(course => course);

    // 創建所有的 course 資料
    // await Course.bulkCreate(courses);

    console.log('Courses Seeder 已成功執行');
}

// 執行 Seeder 函數
seedCourses();

console.log(seedCourses())