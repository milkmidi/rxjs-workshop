import { forkJoin, from, mergeMap, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

{
  const mockPromise = (v: any) => {
    return new Promise((resolve) => {
      window.setTimeout(
        () => {
          resolve(`${v}_map`);
        },
        Math.random() * 1000 + 200,
      );
    });
  };
  // forkJoin 當所有 observables 完成時，發出每個 observable 的最新值。
  of([0, 1, 2, 3])
    .pipe(
      mergeMap((value) => {
        return forkJoin(
          value.map((v) => {
            return from(mockPromise(v));
          }),
        );
      }),
    )
    .subscribe((value) => {
      console.log(value);
    });
}
{
  type TodoType = {
    id: string;
    text: string;
    done: boolean;
  };
  const initWithSelector = {
    selector: (response: Response) => response.json(),
  };
  const API_URL = 'https://my-json-server.typicode.com/milkmidi/typicode/todolist';
  const getAllTodoData = () => {
    return fromFetch<TodoType[]>(API_URL, initWithSelector).pipe(
      mergeMap((todos) => {
        return forkJoin(
          todos.map((todo) => {
            return fromFetch(`${API_URL}/${todo.id}`, initWithSelector);
          }),
        );
      }),
    );
  };

  getAllTodoData().subscribe((res) => {
    console.log('result', res);
  });
}
