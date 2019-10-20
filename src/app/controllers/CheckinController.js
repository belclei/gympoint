import { subDays, startOfDay } from 'date-fns';
const { Op } = require('sequelize');

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll();
    return res.json(checkins);
  }
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: 'Student does not exist.' });
    }
    const created_7daysAgo = subDays(startOfDay(new Date()), 7);

    const checkinsTheLast7Days = await Checkin.count({
      where: {
        created_at: {
          [Op.gte]: created_7daysAgo,
        },
      },
    });

    if (checkinsTheLast7Days >= 5) {
      return res
        .status(400)
        .json({ error: '5 Checkins are permited in 7 days only' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
