import DBService from '../services/DBService';
import { RequestWrapper as Request } from '../core/RequestWrapper';
import { ResponseWrapper as Response } from '../core/ResponseWrapper';

class DBController {
  public async getAllData(_req: Request, res: Response): Promise<void> {
    const data = DBService.findAll();
    res.ok({ data });
  }

  public async getByIdData(req: Request, res: Response): Promise<void> {
    const id = req.getParam('id');
    const data = DBService.findById(id);
    res.ok({ data });
  }

  public async addData(req: Request, res: Response): Promise<void> {
    const data = await req.getBody<{ id: string }>();
    DBService.save(data);
    res.created({ data });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const id = req.getParam('id');
    const data = await req.getBody<object>();
    const updated = DBService.update(id, data);
    res.ok({ data: updated });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id = req.getParam('id');
    DBService.deleteById(id);

    res.noContent();
  }
}

export default new DBController();
