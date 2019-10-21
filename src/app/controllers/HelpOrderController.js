import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
      where: { answer: null },
    });
    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
