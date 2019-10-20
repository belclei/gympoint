import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    return res.json(await Plan.create(req.body));
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number().positive(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    try {
      const plan = await Plan.findByPk(req.params.id);
      return res.json(await plan.update(req.body));
    } catch (error) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }
  }
  async delete(req, res) {
    try {
      const plan = await Plan.findByPk(req.params.id);
      await plan.destroy();
      return res.send();
    } catch (error) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }
  }
}

export default new PlanController();
