const fetchTableData = require('../managerToken/managerToken');

function convertToSlug(input) {
    const convertString = str => {
        return str
            .toLowerCase() // Chuyển thành viết thường
            .normalize('NFD') // Chuẩn hóa Unicode thành các ký tự gốc và dấu phụ
            .replace(/[đĐ]/g, "d")
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu phụ
            .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu -
            .replace(/[^\w-]+/g, ''); // Loại bỏ các ký tự không phải chữ, số, dấu -
    };

    if (typeof input === 'string') {
        return convertString(input);
    } else if (Array.isArray(input)) {
        return input.map(item => convertString(item));
    }
}
function buildTree(coursesData, lessonsData, topicsData) {

    const lessons = lessonsData.data.items;
    const topics = topicsData.data.items;
    const courses = coursesData.data.items;
    const tree = courses.map(course => {
        const relevantLessons = lessons.filter(lesson => {
            const courseNames = lesson.fields.CoursesName.map(item => item.text);
            return courseNames.includes(course.fields.courseName);
        });
        const courseImgLink = course.fields.courseImg ? course.fields.courseImg.link : null;

        const categoryParse = convertToSlug(course.fields.category);
        const courseTree = {
            id: course.id,
            courseImg: courseImgLink,
            courseName: course.fields.courseName,
            lecturer: {
                id: course.fields.lecturer[0].record_ids,
                lecturerName: course.fields.lecturer[0].text,
            },
            price: course.fields.price,
            videoIntro: course.fields.videoIntro,
            category: categoryParse,
            someDetail: course.fields.someDetail,
            courseDecription: course.fields.courseDecription,
            benefit: course.fields.benefit,
            subjects: course.fields.subjects,
            require: course.fields.require,
            Lession: relevantLessons.map(lesson => {
                const relevantTopics = topics.filter(topic => {
                    // Lọc các chủ đề thuộc bài học hiện tại
                    return topic.fields.LessionName.some(lessonName => lessonName.record_ids.includes(lesson.id));
                });

                return {
                    id:lesson.id,
                    LessionsName: lesson.fields.LessionsName,
                    Topic: relevantTopics.map(topic => topic.fields.topicName)
                };
            })
        };

        return courseTree;
    });

    return tree;
}
class CourseController {
    show(req, res, next) {
        Promise.all([
            fetchTableData.fetchTableData('tblaqBttpOVD4Ys7'),
            fetchTableData.fetchTableData('tblWKfeDvgZYFHnO'),
            fetchTableData.fetchTableData('tblqUjMWnHhIYtxu')
        ])
            .then(([courseData, lessonData, topicData]) => {
                return buildTree(courseData, lessonData, topicData);
            })
            .then(treeData => {
                res.json(treeData);
            })
            .catch(next);
    }
}

module.exports = new CourseController;
