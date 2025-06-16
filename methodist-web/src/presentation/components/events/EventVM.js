import {action, computed, makeObservable, observable, toJS} from "mobx";

export const typeSelectAll = {
    name: "Все",
    id: "all"
}

export class EventVM {

    search = ""
    events = []
    sorts = [
        {
            id: 0,
            name: "без сортировки"
        },
        {
            id: 1,
            name: "по убыванию даты мероприятия"
        },
        {
            id: 2,
            name: "по возрастанию даты мероприятия"
        },
        {
            id: 3,
            name: "по убыванию даты добавления формы"
        },
        {
            id: 4,
            name: "по возрастанию даты добавления формы"
        },
        {
            id: 5,
            name: "по убыванию даты изменения формы"
        },
        {
            id: 6,
            name: "по возрастанию даты изменения формы"
        },
    ]
    filters = {
        category: typeSelectAll.id,
        commission: typeSelectAll.id,
        teacher: typeSelectAll.id,
        sorting: this.sorts[0].id,
        dateRange: {
            start: null,
            end: null
        }
    }
    categories = [typeSelectAll]
    commissions = [typeSelectAll]
    teachers = [typeSelectAll]
    dates = [
        {
            id: 0,
            name: "За всё время",
            dateRange: {
                start: null,
                end: null
            }
        },
        {
            id: 1,
            name: "Этот месяц",
            dateRange: {
                start: getCurrentMonthDates().start,
                end: getCurrentMonthDates().end,
            },
        },
        {
            id: 2,
            name: "2024-2025 учебный год",
            dateRange: {
                start: new Date(2024, 8, 1),
                end: new Date(2025, 5, 30)
            }
        },
        {
            id: 3,
            name: "Свой вариант",
            dateRange: {
                start: null,
                end: null
            }
        },
    ]
    currentPage = 1;
    itemsPerPage = 12; //сколько на странице элементов

    constructor() {
        makeObservable(this, {
            search: observable,
            filters: observable,
            events: observable,
            teachers: observable,
            currentPage: observable,
            dates: observable,
            filteredEvents: computed,
            totalPages: computed,
            currentItems: computed,
            setSearch: action,
            setDateRange: action,
            setCategory: action,
            setSorting: action,
            setEvents: action,
            setCommission: action,
            setTeacher: action,
            setCategories: action,
            setCommissions: action,
            setTeachers: action
        })
    }

    setSearch(query) {
        this.search = query
    }

    setCategory(category) {
        this.filters.category = category
    }

    setCommission(commission) {
        this.filters.commission = commission;
    }

    setTeacher(teacher) {
        this.filters.teacher = teacher;
    }

    setSorting(sorting) {
        this.filters.sorting = sorting;
    }

    setCategories(list) {
        this.categories = [
            typeSelectAll,
            ...list
        ];
    }

    setEvents(list) {
        this.events = list;
    }

    setCommissions(list) {
        this.commissions = [
            typeSelectAll,
            ...list
        ];
    }

    setTeachers(list) {
        this.teachers = [
            typeSelectAll,
            ...list
        ];
    }

    setDateRange = (newRange) => {
        //console.log(toJS(newRange))
        this.filters.dateRange = newRange;
    }

    get filteredEvents() {
        this.currentPage = 1;
        const filtered = this.events?.filter(event => {
            const searchMatch = event.name.toLowerCase().includes(this.search.toLowerCase())
            const categoryMatch = this.filters.category === "all" || event.typeOfEvent.id === this.filters.category;
            const commissionMatch = this.filters.commission === "all" || event.profile?.mc?.id === this.filters.commission;
            const teacherMatch = this.filters.teacher === "all" || event.profile?.id === this.filters.teacher;
            let dateMatch = true;
            if (this.filters.dateRange && this.filters.dateRange.start !== null && this.filters.dateRange.end !== null) {
                const startDate = new Date(this.filters.dateRange.start)
                startDate.setHours(0, 0, 0, 0)
                const startTimestamp = startDate.getTime()
                let endTimestamp;
                if (this.filters.dateRange.end) {
                    const endDate = new Date(this.filters.dateRange.end);
                    endDate.setHours(23, 59, 59, 999);
                    endTimestamp = endDate.getTime();
                }
                else {
                    const endDate = new Date(this.filters.dateRange.start);
                    endDate.setHours(23, 59, 59, 999);
                    endTimestamp = endDate.getTime();
                }
                const eventDate = new Date(event.dateOfEvent).getTime()
                dateMatch = eventDate >= startTimestamp && eventDate <= endTimestamp;
            }
            return searchMatch && categoryMatch && commissionMatch && teacherMatch && dateMatch;
        })
        switch(this.filters.sorting) {
            case 1: // Новые → старые (по дате события)
                return [...filtered].sort((a, b) => b.dateOfEvent.localeCompare(a.dateOfEvent));
            case 2: // Старые → новые (по дате события)
                return [...filtered].sort((a, b) => a.dateOfEvent.localeCompare(b.dateOfEvent));
            case 3: // Сначала недавно созданные
                return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            case 4: // Сначала давно созданные
                return [...filtered]    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            case 5: // Сначала недавно созданные
                return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
            case 6: // Сначала давно созданные
                return [...filtered]    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
            default:
                return filtered;
        }
    }

    get currentItems() {
        const indexOfLastItem = this.currentPage * this.itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
        return this.filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    }

    get totalPages() {
        return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    }
}

const getCurrentMonthDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
};