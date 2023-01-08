#include <iostream>
#include <thread> // 标准C++库中对多线程支持的头文件
class thread_guard
{
    std::thread &t;

public:
    explicit thread_guard(std::thread &t_) : t(t_)
    {
    }
    ~thread_guard()
    {
        if (t.joinable()) // 1
        {
            t.join(); // 2
        }
    }

    thread_guard(thread_guard const &) = delete; // 3
    thread_guard &operator=(thread_guard const &) = delete;
};

void fun2(int x)
{
    std::cout << x << std::endl;
}
void do_something_in_current_thread()
{
    std::cout << "do_something." << std::endl;
}
void fun1()
{
    int some_local_state = 0;

    std::thread t(fun2, some_local_state);
    thread_guard g(t);
    do_something_in_current_thread();
}