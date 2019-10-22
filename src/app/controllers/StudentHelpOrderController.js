import * as Yup from 'yup';
import { addMonths, parseISO, startOfDay, isBefore, endOfDay } from 'date-fns';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import Mail from '../../lib/mail';

class StudentHelpOrderController {
  async index(req, res) {
    const { id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: id,
      },
    });
    return res.json(helpOrders);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { question } = req.body;
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student does not exist.' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrder);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { answer } = req.body;
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
        },
      ],
    });
    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order does not exist.' });
    }

    Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Auxílio atendido',
      template: 'helpOrder',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer,
      },
    });

    return res.json(
      await helpOrder.update({
        answer,
        answer_at: new Date(),
      })
    );

    //enviar email ao estudante avisando da atualização da resposta
  }
}

export default new StudentHelpOrderController();
