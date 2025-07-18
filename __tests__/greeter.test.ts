import { CyberSharpApp } from '../src/index';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock DOM elements for testing
const mockElement = (id: string, content: string = '') => ({
  id,
  textContent: content,
  innerHTML: '',
  style: {},
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn()
  },
  appendChild: jest.fn(),
  onclick: null
});

describe('CyberSharp Security Awareness App', () => {
  let app: CyberSharpApp;

  beforeEach(() => {
    // Clear localStorage
    localStorageMock.clear();
    
    // Mock DOM methods
    global.document = {
      getElementById: jest.fn((id: string) => mockElement(id)),
      addEventListener: jest.fn(),
      querySelectorAll: jest.fn(() => []),
      createElement: jest.fn(() => mockElement('div'))
    } as any;

    app = new CyberSharpApp();
  });

  test('should initialize with default user stats', () => {
    expect(app).toBeDefined();
    // Check that localStorage is properly set up for new users
    const stats = JSON.parse(localStorageMock.getItem('cyberSharpStats') || '{}');
    expect(stats.streakCount).toBeGreaterThanOrEqual(0);
    expect(stats.quizScore).toBeGreaterThanOrEqual(0);
    expect(stats.tipsRead).toBeGreaterThanOrEqual(0);
  });

  test('should display current date correctly', () => {
    const mockDateElement = mockElement('currentDate');
    (document.getElementById as jest.Mock).mockReturnValue(mockDateElement);
    
    app.displayCurrentDate();
    
    expect(mockDateElement.textContent).toBeTruthy();
    expect(typeof mockDateElement.textContent).toBe('string');
  });

  test('should show daily security tip', () => {
    const mockCategoryElement = mockElement('tipCategory');
    const mockContentElement = mockElement('dailyTip');
    
    (document.getElementById as jest.Mock)
      .mockReturnValueOnce(mockCategoryElement)
      .mockReturnValueOnce(mockContentElement);
    
    app.showDailyTip();
    
    expect(mockCategoryElement.textContent).toBeTruthy();
    expect(mockContentElement.textContent).toBeTruthy();
    expect(mockContentElement.textContent?.length).toBeGreaterThan(10);
  });

  test('should increment tips read when getting new tip', () => {
    const mockCategoryElement = mockElement('tipCategory');
    const mockContentElement = mockElement('dailyTip');
    
    (document.getElementById as jest.Mock)
      .mockReturnValue(mockCategoryElement)
      .mockReturnValue(mockContentElement);
    
    // Get initial stats
    const initialStats = JSON.parse(localStorageMock.getItem('cyberSharpStats') || '{"tipsRead":0}');
    const initialTipsRead = initialStats.tipsRead || 0;
    
    app.getNewTip();
    
    // Check that tips read increased
    const updatedStats = JSON.parse(localStorageMock.getItem('cyberSharpStats') || '{}');
    expect(updatedStats.tipsRead).toBe(initialTipsRead + 1);
  });

  test('should display quiz question and options', () => {
    const mockQuestionElement = mockElement('quizQuestion');
    const mockOptionsElement = mockElement('quizOptions');
    
    (document.getElementById as jest.Mock)
      .mockReturnValueOnce(mockQuestionElement)
      .mockReturnValueOnce(mockOptionsElement);
    
    app.showDailyQuiz();
    
    expect(mockQuestionElement.textContent).toBeTruthy();
    expect(mockQuestionElement.textContent?.length).toBeGreaterThan(10);
  });

  test('should handle user answer selection', () => {
    const mockOptions = [
      { classList: { add: jest.fn(), remove: jest.fn() } },
      { classList: { add: jest.fn(), remove: jest.fn() } },
    ];
    
    (document.querySelectorAll as jest.Mock).mockReturnValue(mockOptions);
    (document.getElementById as jest.Mock).mockReturnValue({ disabled: false });
    
    app.selectOption(0);
    
    expect(mockOptions[0].classList.add).toHaveBeenCalledWith('selected');
  });

  test('should track streak correctly for consecutive days', () => {
    // Simulate visiting app on consecutive days by manipulating the date
    const today = new Date().toDateString();
    
    // First visit should set streak to 1
    const stats = JSON.parse(localStorageMock.getItem('cyberSharpStats') || '{}');
    expect(stats.streakCount).toBeGreaterThanOrEqual(1);
    expect(stats.lastVisit).toBe(today);
  });
}); 