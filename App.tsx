import { useRef, useState } from "react";
import "./App.css";

function App() {
  // 투두 상태 관리
  const [todos, setTodos] = useState<any[]>([]);

  // input 값 상태
  const [text, setText] = useState("");

  // 우선순위 상태
  const [priority, setPriority] = useState("보통");

  // 수정 중인 todo id
  const [editId, setEditId] = useState<number | null>(null);

  // 필터 상태
  const [filter, setFilter] = useState("all");

  // 섹션 이동용 ref
  const homeRef = useRef<HTMLElement | null>(null);
  const todoRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);

  // 스크롤 이동 함수
  const scrollToSection = (
    ref: React.RefObject<HTMLElement | null>
  ) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // 추가 / 수정 함수
  const handleAddTodo = () => {
    if (!text.trim()) return;

    // 수정 모드일 때
    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId
            ? {
                ...todo,
                text,
                priority,
              }
            : todo
        )
      );

      setEditId(null);
    } else {
      // 새 투두 추가
      const newTodo = {
        id: Date.now(),
        text,
        priority,
        completed: false,
      };

      setTodos([...todos, newTodo]);
    }

    // 입력값 초기화
    setText("");
    setPriority("보통");
  };

  // 완료 처리
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

  // 수정 버튼 클릭
  const handleEdit = (todo: any) => {
    setText(todo.text);
    setPriority(todo.priority);
    setEditId(todo.id);

    // 수정할 때 Todo 영역으로 이동
    scrollToSection(todoRef);
  };

  // 삭제
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "정말 삭제하시겠습니까?"
    );

    if (confirmDelete) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // 필터링
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // 남은 할 일 개수
  const remainingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="logo">My Todo</h1>

        <nav className="nav">
          <button onClick={() => scrollToSection(homeRef)}>
            Home
          </button>

          <button onClick={() => scrollToSection(todoRef)}>
            Todo
          </button>

          <button onClick={() => scrollToSection(aboutRef)}>
            About
          </button>
        </nav>
      </header>

      {/* Home */}
      <section className="home" ref={homeRef}>
        <div className="home-content">
          <h2>오늘 할 일을 정리해보세요</h2>

          <p>
            간단한 투두리스트로 해야 할 일을 관리할 수
            있습니다
          </p>

          <button
            className="start-btn"
            onClick={() => scrollToSection(todoRef)}
          >
            투두 작성하기
          </button>
        </div>
      </section>

      {/* Todo */}
      <section className="todo-section" ref={todoRef}>
        <div className="todo-card">
          <h2>Todo List</h2>

          {/* 입력 영역 */}
          <div className="todo-input-area">
            <input
              type="text"
              placeholder="할 일을 입력하세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>낮음</option>
              <option>보통</option>
              <option>높음</option>
            </select>

            <button onClick={handleAddTodo}>
              {editId !== null ? "저장" : "추가"}
            </button>
          </div>

          {/* 필터 버튼 */}
          <div className="filter-buttons">
            <button onClick={() => setFilter("all")}>
              전체
            </button>

            <button onClick={() => setFilter("active")}>
              진행중
            </button>

            <button onClick={() => setFilter("completed")}>
              완료
            </button>
          </div>

          {/* 남은 할 일 */}
          <p className="remaining">
            남은 할 일 : {remainingTodos}개
          </p>

          {/* 투두 목록 */}
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${
                  todo.completed ? "completed" : ""
                }`}
              >
                <div>
                  <h3>{todo.text}</h3>

                  <p>우선순위 : {todo.priority}</p>
                </div>

                <div className="todo-buttons">
                  <button
                    onClick={() =>
                      toggleComplete(todo.id)
                    }
                  >
                    완료
                  </button>

                  <button
                    onClick={() => handleEdit(todo)}
                  >
                    수정
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(todo.id)
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" ref={aboutRef}>
        <div className="about-card">
          <h2>About</h2>

          <p>
            이 프로젝트는 <mark>React와 Vite</mark>를 사용해 만든
            간단한 투두리스트 웹사이트입니다.
          </p>

          <p>
            React Router와 백엔드는 사용하지 않았으며,
            useState만 사용해서 프론트엔드에서 데이터를
            관리합니다.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;