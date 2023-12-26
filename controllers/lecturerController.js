const fetchTableData = require('../managerToken/managerToken');

function buildTree(lectureData) {

    const lectures = lectureData.data.items;
    const tree = lectures.map(lecture => {
        const lectureImgLink = lecture.fields.img ? lecture.fields.img.link : null;

        const lectureTree = {
            id: lecture.id,
            lectureImg: lectureImgLink,
            lectureName: lecture.fields.lecturerName,
            lecturerDescription: lecture.fields.lecturerDescription,
        };

        return lectureTree;
    });

    return tree;
}

class lecturerController {
    show(req, res, next) {
        fetchTableData.fetchTableData('tbl9rxiasTJgkylV')
            .then((lectureData) => {
                return buildTree(lectureData);
            })
            .then(treeData => {
                res.json(treeData);
            })
            .catch(next);
    }
}

module.exports = new lecturerController;
