import cfnResp from 'cfn-response';
import rewire from 'rewire';
import * as _lambda from '../src/lambda/index';
import { constructCFNCRREvent, constructCFNCRRContext } from './utils/helpers';

jest.spyOn(global.console, 'log').mockImplementation();
const _lambdaModule = rewire('../lib/lambda/index');
_lambdaModule.__set__('console', {
  log: jest.fn(() => {}),
});

describe('Test Lambda', () => {
  it('should call on_create', async () => {
    const mockOnCreate = jest.fn(() => {});
    const revert = _lambdaModule.__set__('on_create', mockOnCreate);
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();

    _lambdaModule.on_event(event, context);
    expect(mockOnCreate).toHaveBeenCalled();

    revert();
  });

  it('should send', async () => {
    const cfnRespSendMock = jest.spyOn(cfnResp, 'send').mockImplementation();
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(cfnRespSendMock).toHaveBeenCalled();
    expect(cfnRespSendMock.mock.calls[0][2]).toBe('SUCCESS');
  });
});