import nock from 'nock';
import rewire from 'rewire';
import { constructCFNCRREvent, constructCFNCRRContext } from './utils/helpers';

process.env.AWS_REGION = 'us-east-1';
const _lambda = rewire('../src/lambda/index');
let consoleRevert: { (): void; (): void };

describe('Test Lambda', () => {
  beforeAll(() => {
    consoleRevert = _lambda.__set__('console', {
      log: jest.fn(() => {}),
    });
  });

  afterAll(() => {
    consoleRevert();
  });

  it('should call on_create', async () => {
    const _onCreate = jest.fn(() => {});
    let revert = _lambda.__set__('on_create', _onCreate);
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(_onCreate).toHaveBeenCalled();

    revert();
  });

  it('should send SUCCESS when call on_create', async () => {
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();
    const _sendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revertSendResponse = _lambda.__set__('sendResponse', _sendResponse);

    _lambda.on_event(event, context);
    expect(_sendResponse).toHaveBeenCalled();
    expect(_sendResponse.mock.calls[0][2]).toBe('SUCCESS');
    expect(_sendResponse.mock.calls[0][3]).toEqual({
      password: 'WzRdsEz/2FJQQt+rwbD6tTVhwGOQ7EZuFPZcbvrfFUsZYv0=',
    });
    revertSendResponse();
  });

  it('should call on_update', async () => {
    const _onCreate = jest.fn(() => {});
    let revert = _lambda.__set__('on_update', _onCreate);
    const event = constructCFNCRREvent({
      RequestType: 'Update',
    });
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(_onCreate).toHaveBeenCalled();

    revert();
  });

  it('should send SUCCESS when call on_update', async () => {
    const event = constructCFNCRREvent({
      RequestType: 'Update',
    });
    const context = constructCFNCRRContext();
    const _sendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revertSendResponse = _lambda.__set__('sendResponse', _sendResponse);

    _lambda.on_event(event, context);
    expect(_sendResponse).toHaveBeenCalled();
    expect(_sendResponse.mock.calls[0][2]).toBe('SUCCESS');

    revertSendResponse();
  });

  it('should call on_delete', async () => {
    const _onDelete = jest.fn(() => {});
    let revert = _lambda.__set__('on_delete', _onDelete);
    const event = constructCFNCRREvent({
      RequestType: 'Delete',
    });
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(_onDelete).toHaveBeenCalled();

    revert();
  });

  it('should send SUCCESS when call on_delete', async () => {
    const event = constructCFNCRREvent({
      RequestType: 'Delete',
    });
    const context = constructCFNCRRContext();
    const _sendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revertSendResponse = _lambda.__set__('sendResponse', _sendResponse);

    _lambda.on_event(event, context);
    expect(_sendResponse).toHaveBeenCalled();
    expect(_sendResponse.mock.calls[0][2]).toBe('SUCCESS');

    revertSendResponse();
  });

  it('should send', async () => {
    const _sendResponse = jest.fn((_event, _context, _responseStatus, _responseDat) => {});
    let revert = _lambda.__set__('sendResponse', _sendResponse);
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();

    _lambda.on_event(event, context);
    expect(_sendResponse).toHaveBeenCalled();
    expect(_sendResponse.mock.calls[0][2]).toBe('SUCCESS');
    revert();
  });
});

let _console = jest.fn((_msg, _object) => {});

describe('Secure Lambda', () => {
  beforeAll(() => {
    consoleRevert = _lambda.__set__('console', {
      log: _console,
    });
  });

  afterAll(() => {
    consoleRevert();
  });

  it('should NOT log password', async () => {
    const event = constructCFNCRREvent();
    const context = constructCFNCRRContext();
    nock('https://local.cloudformation.com')
      .put('/test')
      .reply(200, { results: {} });

    _lambda.on_event(event, context);
    expect(_console).toHaveBeenCalled();
    expect(_console.mock.calls[0][0].ResourceProperties.SecretKey).toBeNull();
    expect(_console.mock.calls[3][1].Data.password).toBeNull();
  });
});
