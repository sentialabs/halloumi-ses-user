import rewire from 'rewire';
import { constructCFNCRREvent, constructCFNCRRContext } from './utils/helpers';

process.env.AWS_REGION = 'us-east-1';
jest.spyOn(global.console, 'log').mockImplementation();
const _lambda = rewire('../src/lambda/index');
_lambda.__set__('console', {
  log: jest.fn(() => {}),
});

describe('Test Lambda', () => {

  it('should call on_create', async () => {
    const mockOnCreate = jest.fn(() => {});
    let revert = _lambda.__set__('on_create', mockOnCreate);
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(mockOnCreate).toHaveBeenCalled();

    revert();
  });

  it('should send SUCCESS when call on_create', async () => {
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();
    const mockSendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revertSendResponse = _lambda.__set__('sendResponse', mockSendResponse);

    _lambda.on_event(event, context);
    expect(mockSendResponse).toHaveBeenCalled();
    expect(mockSendResponse.mock.calls[0][2]).toBe('SUCCESS');
    expect(mockSendResponse.mock.calls[0][3]).toEqual({
      password: 'WzRdsEz/2FJQQt+rwbD6tTVhwGOQ7EZuFPZcbvrfFUsZYv0=',
    });
    revertSendResponse();
  });

  it('should call on_update', async () => {
    const mockOnCreate = jest.fn(() => {});
    let revert = _lambda.__set__('on_update', mockOnCreate);
    const event = constructCFNCRREvent({
      RequestType: 'Update',
    });
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(mockOnCreate).toHaveBeenCalled();

    revert();
  });

  it('should send SUCCESS when call on_update', async () => {
    const event = constructCFNCRREvent({
      RequestType: 'Update',
    });
    const context = constructCFNCRRContext();
    const mockSendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revertSendResponse = _lambda.__set__('sendResponse', mockSendResponse);

    _lambda.on_event(event, context);
    expect(mockSendResponse).toHaveBeenCalled();
    expect(mockSendResponse.mock.calls[0][2]).toBe('SUCCESS');

    revertSendResponse();
  });

  it('should call on_delete', async () => {
    const mockOnDelete = jest.fn(() => {});
    let revert = _lambda.__set__('on_delete', mockOnDelete);
    const event = constructCFNCRREvent({
      RequestType: 'Delete',
    });
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(mockOnDelete).toHaveBeenCalled();

    revert();
  });

  it('should send SUCCESS when call on_delete', async () => {
    const event = constructCFNCRREvent({
      RequestType: 'Delete',
    });
    const context = constructCFNCRRContext();
    const mockSendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revertSendResponse = _lambda.__set__('sendResponse', mockSendResponse);

    _lambda.on_event(event, context);
    expect(mockSendResponse).toHaveBeenCalled();
    expect(mockSendResponse.mock.calls[0][2]).toBe('SUCCESS');

    revertSendResponse();
  });

  it('should send', async () => {
    const mockSendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revert = _lambda.__set__('sendResponse', mockSendResponse);
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(mockSendResponse).toHaveBeenCalled();
    expect(mockSendResponse.mock.calls[0][2]).toBe('SUCCESS');
    revert();
  });
});