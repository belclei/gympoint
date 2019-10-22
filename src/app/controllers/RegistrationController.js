import * as Yup from 'yup';
import {
  addMonths,
  parseISO,
  startOfDay,
  isBefore,
  endOfDay,
  format,
} from 'date-fns';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Registration from '../models/Registration';

import Mail from '../../lib/mail';

class RegistrationController {
  async index(req, res) {
    const Registrations = await Registration.findAll({
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: Plan,
          as: 'plan',
        },
      ],
    });
    return res.json(Registrations);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Student does not exist.' });
    }
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan does not exist.' });
    }

    const dayStart = startOfDay(parseISO(start_date));
    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }

    const end_date = endOfDay(addMonths(dayStart, plan.duration));
    const price = (plan.price * plan.duration).toFixed(2);

    //todo: enviar email ao student
    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula efetuada',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(dayStart, 'dd/MM/yyyy'),
        end_date: format(end_date, 'dd/MM/yyyy'),
        price,
      },
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Registration does not exist.' });
    }
    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ error: 'Student does not exist.' });
    }
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan does not exist.' });
    }

    const dayStart = startOfDay(parseISO(start_date));
    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const end_date = endOfDay(addMonths(dayStart, plan.duration));
    const price = (plan.price * plan.duration).toFixed(2);

    const newRegistration = await registration.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula efetuada',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(dayStart, 'dd/MM/yyyy'),
        end_date: format(end_date, 'dd/MM/yyyy'),
        price,
      },
    });

    return res.json(newRegistration);
  }

  async delete(req, res) {
    try {
      const registration = await Registration.findByPk(req.params.id);
      await registration.destroy();
      return res.send();
    } catch (error) {
      return res.status(404).json({ error: 'Registration does not exist' });
    }
  }
}

export default new RegistrationController();
