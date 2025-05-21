import {action, computed, makeObservable, observable} from "mobx";

export class EventStore {

    search = ""
    events = []
    typeSelectAll = {
        name: "Все",
        id: "all"
    }
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
    ]
    filters = {
        category: this.typeSelectAll.id,
        commission: this.typeSelectAll.id,
        teacher: this.typeSelectAll.id,
        sorting: this.sorts[0].id
    }
    categories = [this.typeSelectAll]
    commissions = [this.typeSelectAll]
    teachers = [this.typeSelectAll]
    currentPage = 1;
    itemsPerPage = 12; //сколько на странице элементов

    constructor() {
        makeObservable(this, {
            search: observable,
            filters: observable,
            events: observable,
            teachers: observable,
            currentPage: observable,
            filteredEvents: computed,
            totalPages: computed,
            currentItems: computed,
            setSearch: action,
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
            this.typeSelectAll,
            ...list
        ];
    }

    setEvents(list) {
        this.events = list;
    }

    setCommissions(list) {
        this.commissions = [
            this.typeSelectAll,
            ...list
        ];
    }

    setTeachers(list) {
        this.teachers = [
            this.typeSelectAll,
            ...list
        ];
    }

    get filteredEvents() {
        this.currentPage = 1;
        const filtered = this.events?.filter(event =>
            event.name.toLowerCase().includes(this.search.toLowerCase()) &&
            (this.filters.category === "all" || event.typeOfEvent.id === this.filters.category) &&
            (this.filters.commission === "all" || event.profile?.mc?.id === this.filters.commission) &&
            (this.filters.teacher === "all" || event.profile?.id === this.filters.teacher)
        );
        switch(this.filters.sorting) {
            case 1: // Новые → старые (по дате события)
                return [...filtered].sort((a, b) => b.dateOfEvent.localeCompare(a.dateOfEvent));
            case 2: // Старые → новые (по дате события)
                return [...filtered].sort((a, b) => a.dateOfEvent.localeCompare(b.dateOfEvent));
            case 3: // Сначала недавно созданные
                return [...filtered].sort((a, b) => b.сreatedAt.localeCompare(a.сreatedAt));
            case 4: // Сначала давно созданные
                return [...filtered]    .sort((a, b) => a.сreatedAt.localeCompare(b.сreatedAt));
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

const eventStore = new EventStore()
export { eventStore }