import * as cfnResp from 'cfn-response';
import { on_event } from '../src/lambda/index';
import { constructCFNCRREvent, constructCFNCRRContext } from './utils/helpers';

describe('Test Lambda', () => {
  it('should return True', async () => {
    const addMock = jest.spyOn(cfnResp, 'send');

    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();
    on_event(event, context);
    expect(addMock).toHaveBeenCalled();
    expect(addMock.mock.calls[0][2]).toBe('SUCCESS');
  });
});